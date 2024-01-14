# ES-LIB

This library is an extension for DDD-lib assing support for Event Sourcing for NestJS would be a powerful tool for developing robust and scalable applications. Let's call this library "ES-Lib"

## Main Support:

- Integrated with DDD-Lib, encourages the use of DDD principles by providing abstractions and utilities for defining entities, aggregates, value objects, and repositories in a clean and modular way. It promotes the separation of concerns between the application's business logic and infrastructure, making it easier to manage complex domain models.

- Event Sourcing Support: The library embraces the Event Sourcing pattern, allowing developers to model and store changes to the application state as a sequence of immutable events. Provides decorators and utilities for defining events, aggregates, and event handlers, making it intuitive to implement and maintain Event Sourcing in the application.

- Integrated with CQRS (Command Query Responsibility Segregation): ES-Lib and DDD-Lib supports CQRS by providing abstractions for defining commands and queries separately, helping to improve the scalability and maintainability of the application.

- Event Bus Integration: Integrates seamlessly with NestJS's event bus system, allowing easy communication between different parts of the application using events. Supports various event storage mechanisms, including in-memory, databases, or external event stores, providing flexibility in choosing the right storage solution for the application.
