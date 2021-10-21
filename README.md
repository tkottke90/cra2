## CRA2

Boilerplate Express/Typescript server framework that 

## Application Structure
```
├── docs
├── scripts
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── classes
│   │   ├── abstract-directory-parser.class.ts
│   │   ├── base-route.class.ts
│   │   ├── route-decorators.class.ts
│   │   ├── route.class.ts
│   │   └── <class files here>
│   ├── controllers
│   │   ├── index.ts
│   │   └── <controller files here>
│   ├── errors
│   │   └── <error class files here>
│   ├── decorators
│   │   └── <decorator files here>
│   ├── hooks
│   │   └── <hook files here>
│   ├── middleware
│   │   └── <middleware files here>
│   ├── models
│   │   ├── index.ts
│   │   └── <model files here>
│   └── services
│       ├── index.ts
│       └── <service files here>
├── test
│   ├── index.test.ts
│   └── <test files here>
```

The application is broken up into a view primary directories:
- Services
  - 
- Models
  - This is the data access layer that houses ORM models which can interact with a data store
- Controllers
  - This is the transport layer that houses the express js routers and any hooks to be run on inbound request


| Directory | Description |
| :-: | --- |
| docs | Location of any documentation for the API |
| scripts | Location of any utility scripts for the API |
| src | Location of the source code
| test | Location of unit and integration tests |

