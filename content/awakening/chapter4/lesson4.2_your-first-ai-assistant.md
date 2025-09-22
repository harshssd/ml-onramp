---
id: ai-awakening-ch4-lesson2
title: Your First AI Assistant
duration_min: 30
prereqs: ["ai-awakening-ch4-lesson1"]
tags: ["beginner","hands-on","assistant"]
video:
  platform: youtube
  id: wx3OQxGkR8U
  start: 0
  end: 480
widgets:
  - type: "pyodide_runner"
    starter_code: |
      responses = {
        "hello": "Hi there! I'm your first AI assistant.",
        "how are you": "I'm doing great and ready to help!",
        "bye": "Goodbye!"
      }
      user = input("Say something: ").lower()
      print(responses.get(user, "I don't know how to respond yet."))
goals:
  - Build a simple rule-based chatbot
  - See how interactivity works
quiz:
  - q: Which of these is a limitation of a rule-based assistant?
    options: ["It can't answer unseen questions","It requires training data","It needs GPU","It self-learns"]
    answer: 0
    explain: Rule-based bots only know pre-programmed responses.
flashcards:
  - Chatbot: AI assistant that interacts via conversation
  - Rule-Based System: Predefined input-output mapping
reflection:
  - "What new response would you add to your chatbot to make it more fun?"
next: "ai-awakening-ch4-lesson3"
---

## Watch
Watch [Simple Chatbot Tutorial](https://www.youtube.com/watch?v=wx3OQxGkR8U) (0–8 min).

## Do
Use the code editor to build your first AI assistant. Try adding new responses!
