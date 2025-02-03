from langchain_groq import ChatGroq
from langgraph.graph import StateGraph
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_community.tools import DuckDuckGoSearchResults
from langchain_community.utilities import DuckDuckGoSearchAPIWrapper
from langgraph.checkpoint.memory import MemorySaver
from utils import State

# init chatbot
llm = ChatGroq(model="llama-3.1-8b-instant")

# search tool
wrapper = DuckDuckGoSearchAPIWrapper(max_results=5)
tool = DuckDuckGoSearchResults(api_wrapper=wrapper, source="news")
tools = [tool]
llm = llm.bind_tools(tools)

# memory & graph setup
memory = MemorySaver()
graph_builder = StateGraph(State)

def chatbot(state: State):
    return {"messages": [llm.invoke(state["messages"])]}

tool_node = ToolNode(tools=[tool])
graph_builder.add_node("chatbot", chatbot)
graph_builder.add_node("tools", tool_node)
graph_builder.set_entry_point("chatbot")
graph_builder.add_conditional_edges("chatbot", tools_condition)
graph_builder.add_edge("tools", "chatbot")
graph = graph_builder.compile(checkpointer=memory)

config = {"configurable": {"thread_id": "1"}}

def stream_graph_updates(user_input: str) -> str:
    """Process user input through the LangGraph chatbot."""
    events = graph.stream(
        {"messages": [{"role": "user", "content": user_input}]},
        config,
        stream_mode="values"
    )
    return list(events)[-1]["messages"][-1].content
