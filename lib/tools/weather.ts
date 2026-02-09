import { tool } from "ai";
import { z } from "zod";

/**
 * TODO: Implement the weather data tool
 *
 * This tool should:
 * 1. Accept parameters for location, forecast days, and weather variables
 * 2. Use the Open-Meteo API to fetch weather forecast data
 * 3. Return structured weather data that the LLM can use to answer questions
 *
 * Open-Meteo API docs: https://open-meteo.com/en/docs
 * Base URL: https://api.open-meteo.com/v1/forecast
 *
 * Example API call:
 *   https://api.open-meteo.com/v1/forecast?latitude=35.6762&longitude=139.6503&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3
 *
 * Steps to implement:
 *   a. Define the tool parameters schema using Zod:
 *      - latitude (number, required): Latitude of the location
 *      - longitude (number, required): Longitude of the location
 *      - forecast_days (number, optional, default 3): Number of days to forecast (1-7)
 *      - daily (array of strings, optional): Weather variables to include
 *        Useful variables: temperature_2m_max, temperature_2m_min,
 *        precipitation_sum, windspeed_10m_max, weathercode
 *
 *   b. Make a fetch request to the Open-Meteo API with the parameters
 *
 *   c. Parse the JSON response and return it
 *
 *   d. Handle errors:
 *      - API errors (non-200 status)
 *      - Network failures
 *      - Invalid response format
 *
 * Hints:
 *   - The LLM will provide latitude/longitude — you can trust it to geocode city names
 *   - Open-Meteo is free and requires no API key
 *   - Keep the return format simple — the LLM will format it for the user
 */

export const weatherTool = tool({
  description:
    "Get weather forecast data for a location. Use this when the user asks about weather, temperature, rain, wind, or forecasts for any location.",
  parameters: z.object({
    latitude: z.number().describe("Latitude of the location"),
    longitude: z.number().describe("Longitude of the location"),
    forecast_days: z
      .number()
      .min(1)
      .max(16)
      .default(3)
      .describe("Number of days to forecast (1-16)"),
    daily: z
      .array(z.string())
      .default([
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_sum",
        "weathercode",
        "windspeed_10m_max",
      ])
      .describe(
        "Weather variables to include. Defaults to max/min temp, precipitation, and wind speed.",
      ),
    timezone: z
      .string()
      .default("auto")
      .describe("Timezone for the forecast. Defaults to auto."),
  }),
  execute: async ({ latitude, longitude, forecast_days, daily, timezone }) => {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        forecast_days: forecast_days.toString(),
        daily: daily.join(","),
        timezone,
      });

      // Build the API URL
      const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

      // Fetch the weather data
      const response = await fetch(url);

      // Handle API errors (non-200 status)
      if (!response.ok) {
        throw new Error(
          `Weather API error: ${response.status} ${response.statusText}`,
        );
      }

      // Parse the JSON response
      const data = await response.json();
      return data;
    } catch (error) {
      // Handle network or JSON parsing errors
      console.error("Error fetching weather data:", error);
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});
