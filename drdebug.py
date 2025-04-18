import argparse
from llm.openai_llm import OpenAIModel  # Claude can be added later

def get_llm(name):
    if name.startswith("openai:"):
        return OpenAIModel(name.split(":")[1])
    else:
        raise ValueError("Unsupported LLM model")

def main():
    parser = argparse.ArgumentParser(description="Dr.Debug – AI Debugging Assistant")
    parser.add_argument("--llm", type=str, default="openai:gpt-4o",
                        help="Choose LLM provider and model (e.g. openai:gpt-4o)")
    args = parser.parse_args()

    print("\n🐛 Welcome to Dr.Debug! Paste your error message, stack trace, or buggy code below.")
    user_input = input(">>> ")

    llm = get_llm(args.llm)

    while True:
        print("\n🧠 Thinking...\n")
        explanation = llm.generate(user_input)
        print("\n💡 Suggestion:\n")
        print(explanation)

        next_step = input("\n❓ Want to ask a follow-up or add more context? (y/n): ").strip().lower()
        if next_step != 'y':
            print("\n👋 Exiting. Good luck fixing that bug!")
            break

        user_input = input("\n📝 Add more details or follow-up question:\n>>> ")

if __name__ == "__main__":
    main()
