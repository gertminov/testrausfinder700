import {createMcpHandler} from "mcp-handler"
import {selectionSchema} from "@/lib/dimensions";
import {findTests} from "@/lib/engine";
import {allTests} from "@/lib/tests";


const handler = createMcpHandler((server) => {
        server.registerTool(
            "find-tests",
            {
                description: "Finds tests that can be performed on data with given criteria",
                inputSchema: selectionSchema
            },
            async (input) => {
                const res = findTests(allTests, input)
                const dings = {
                    selectableCriteria: res.possibleCriteria,
                    matchingTests: res.possibleTests
                }
                return {
                    content: [{type: "text", text: JSON.stringify(dings, null, 2)}]
                }
            }
        )
    }
)

export {handler as GET, handler as POST}