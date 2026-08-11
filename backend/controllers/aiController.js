// AI Controller: Generates real-time demand, inventory, and procurement insights
// by fetching current database state from SQLite and querying OpenAI in a single request.

const OpenAI = require("openai");
const db = require("../config/db");

async function getAIInsights(req, res, next) {
  try {
    // 1. Query SQLite for current real inventory & low stock items
    const inventoryItems = await db.all(
      `SELECT i.id, i.name, i.quantity, i.unit, i.reorder_level, i.cost_per_unit,
              c.name AS category_name, s.name AS supplier_name
       FROM inventory i
       LEFT JOIN categories c ON i.category_id = c.id
       LEFT JOIN suppliers s ON i.supplier_id = s.id`
    );

    // 2. Query SQLite for recent demand forecasts
    const demandForecasts = await db.all(
      `SELECT df.forecast_date, df.predicted_demand, df.confidence_score, df.notes,
              i.name AS inventory_name
       FROM demand_forecasts df
       LEFT JOIN inventory i ON df.inventory_id = i.id
       ORDER BY df.forecast_date DESC
       LIMIT 10`
    );

    // Filter low stock items requiring attention
    const lowStockItems = inventoryItems.filter(
      (item) => Number(item.quantity) <= Number(item.reorder_level)
    );

    const totalInventoryValue = inventoryItems.reduce(
      (acc, item) => acc + Number(item.quantity) * Number(item.cost_per_unit),
      0
    );

    // Build minimal context payload for AI prompt
    const compactData = {
      totalItemsCount: inventoryItems.length,
      totalInventoryValue: totalInventoryValue.toFixed(2),
      lowStockCount: lowStockItems.length,
      lowStockDetails: lowStockItems.map((item) => ({
        name: item.name,
        category: item.category_name || "General",
        currentQuantity: item.quantity,
        reorderLevel: item.reorder_level,
        unit: item.unit,
        supplier: item.supplier_name || "Unassigned",
        costPerUnit: item.cost_per_unit,
      })),
      recentDemandForecasts: demandForecasts.map((df) => ({
        item: df.inventory_name || "Unknown",
        date: df.forecast_date,
        predictedDemand: df.predicted_demand,
        confidence: df.confidence_score,
      })),
    };

    // Fallback handler if OPENAI_API_KEY is not set or API fails
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.trim() === "" || apiKey === "your_openai_api_key") {
      const riskLevel = lowStockItems.length > 2 ? "high" : lowStockItems.length > 0 ? "medium" : "low";
      const topLowItem = lowStockItems[0];
      
      const fallbackResponse = {
        demandInsight: demandForecasts.length > 0
          ? `Demand trends highlight incoming requirements for ${demandForecasts[0].inventory_name || "core stocks"}. Monitor reorder points closely.`
          : `Insufficient historical demand records to project long-term velocity. Current operational demand aligns with catalog baselines.`,
        inventoryInsight: lowStockItems.length > 0
          ? `${lowStockItems.length} inventory item(s) are below reorder thresholds: ${lowStockItems.map((i) => i.name).join(", ")}.`
          : `All ${inventoryItems.length} inventory item(s) are operating above reorder safety limits.`,
        procurementRecommendation: topLowItem
          ? `Reorder recommended for ${topLowItem.name} (Current: ${topLowItem.quantity} ${topLowItem.unit}, Threshold: ${topLowItem.reorder_level} ${topLowItem.unit}) from supplier ${topLowItem.supplier_name || "Primary Vendor"}.`
          : `No urgent procurement orders needed at this time. Maintain standard reorder monitoring.`,
        riskLevel,
        summary: `Analyzed ${inventoryItems.length} inventory items totaling $${totalInventoryValue.toLocaleString()}. ${lowStockItems.length} item(s) require reorder attention.`,
        isFallback: true,
      };

      return res.status(200).json({
        success: true,
        data: fallbackResponse,
      });
    }

    // 3. Initialize OpenAI client safely
    const openai = new OpenAI({ apiKey });

    const systemPrompt = `You are an inventory and procurement AI assistant for BlueWave Aquaculture Pvt. Ltd.
Analyze ONLY the provided real application data from the SQLite database.
Do not invent numbers. If data is sparse, explicitly state so.
You must return a valid JSON object matching this exact structure:
{
  "demandInsight": "Concise analysis of expected demand direction & trends based on data",
  "inventoryInsight": "Concise breakdown of current stock levels, low-stock alerts, or overstock concerns",
  "procurementRecommendation": "Actionable purchase recommendation with item name, suggested action, and reason",
  "riskLevel": "low | medium | high",
  "summary": "Short overall summary for the dashboard"
}`;

    const userPrompt = `Real Aquaculture Database Context:\n${JSON.stringify(compactData)}`;

    // 4. Single OpenAI API call with JSON mode and low max_tokens to preserve credits
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 450,
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content;
    let parsedInsight;

    try {
      parsedInsight = JSON.parse(content);
    } catch (parseError) {
      throw new Error("Failed to parse JSON response from AI provider");
    }

    return res.status(200).json({
      success: true,
      data: parsedInsight,
    });
  } catch (error) {
    console.error("AI Controller Error:", error.message);
    
    // Provide structured error/fallback response so client never crashes
    return res.status(200).json({
      success: true,
      data: {
        demandInsight: "Unable to reach external AI service. Analyzing local demand records.",
        inventoryInsight: "Operational stock analysis active. Check Inventory page for exact quantities.",
        procurementRecommendation: "Verify reorder levels manually on the Inventory tab.",
        riskLevel: "medium",
        summary: `AI analysis service error (${error.message}). Database metrics remaining active.`,
        isError: true,
      },
    });
  }
}

module.exports = {
  getAIInsights,
};
