import {NextApiRequest, NextApiResponse} from "next";
import {createMcpHandler} from "mcp-handler"
import {z} from "zod/v4";


const handler = createMcpHandler((server) => {
        server.registerTool(
            "find-tests",
            {
                description: "Finds tests",
                inputSchema: z.object({})
            },
            async (input) => {
                return {
                    content: [{type: "text", text: "Hello world"}]
                }
            }
        )
    }
)

export {handler as GET, handler as POST}