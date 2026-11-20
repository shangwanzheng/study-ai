/** 假工具：模拟你们后端 API */

const tickets = [];

export const TOOLS = [
  {
    name: "getWeather",
    description: "查询城市天气。用户明确问天气/气温时使用。",
    parameters: {
      type: "object",
      properties: { city: { type: "string" } },
      required: ["city"],
    },
  },
  {
    name: "createTicket",
    description: "创建工单。已有结构化 title/priority 时使用。",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        priority: { type: "string", enum: ["low", "medium", "high"] },
      },
      required: ["title", "priority"],
    },
  },
];

export function getWeather({ city }) {
  return {
    city,
    tempC: 22,
    condition: "多云",
    source: "fake-weather-api",
  };
}

export function createTicket({ title, priority }) {
  const ticket = {
    id: `T-${tickets.length + 1}`,
    title,
    priority,
    status: "open",
  };
  tickets.push(ticket);
  return ticket;
}
