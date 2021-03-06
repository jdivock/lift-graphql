<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Chalk Lifts *](#chalk-lifts-)
  - [Setup](#setup)
    - [Prereqs](#prereqs)
    - [Setup](#setup-1)
  - [Relay Queries](#relay-queries)
    - [Basic](#basic)
    - [Mutations](#mutations)
      - [Remove Lift](#remove-lift)
      - [Add Lift](#add-lift)
      - [Edit Lift](#edit-lift)
    - [Other Random Relay queries that may or may not work](#other-random-relay-queries-that-may-or-may-not-work)
        - [Getting 'first' for free with connections](#getting-first-for-free-with-connections)
        - [Kitchen Sink](#kitchen-sink)
        - [Finding by globalId](#finding-by-globalid)
        - [Using Cursors](#using-cursors)
  - [DB (knex)](#db-knex)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Chalk Lifts [![Build Status](https://travis-ci.org/jdivock/chalk-lifts.svg?branch=master)](https://travis-ci.org/jdivock/chalk-lifts)

Yeah, writing this (again), using graphQL/Relay, let's see if I can actually get it working.

## Setup

### Prereqs

* Postgres (may do sqllite for dev)

### Setup

```sh
> npm install
> npm start
```

Relay GraphIQL on http://localhost:8080
App on http://localhost:3000

### Schema updates

```sh
> npm run update-schema
```

## Relay Queries

### Basic
```
{
  user(email:"jay@jay.com") {
    workouts {
      edges {
        node {
          id,
          name
          lifts {
            edges {
              node {
                id,
                name,
              }
            }
          }
        }
      }
    }
  }
}
```

### Mutations

#### Remove Lift
```js
mutation RemoveLiftMutation($input: RemoveLiftMutationInput!) {
  removeLift(input: $input) {
    removedLiftId,
    workout {
      id,
      name,
      lifts {
        edges {
          node {
            id,
            name,
          }
        }
      }
    }
  }
}

// Variables
{
  "input": {
    "id": "TGlmdDozMzY",
    "clientMutationId": 0
  }
}
```

#### Add Lift
```js
mutation addLift($input: AddLiftMutationInput!) {
  addLiftMutation(input: $input) {
    newLiftEdge {
      node {
        id,
        sets,
        weight,
        reps,
      }
    },
    workout {
      id,
      name,
      lifts {
        edges {
          node {
            id,
            name,
            reps
          }
        }
      }
    }
    clientMutationId
  }
}

// Variables
{
  "input": {
    "workout_id": "V29ya291dDox",
    "sets": 1,
    "reps": 2,
    "weight": 100,
    "name": "stuff",
    "clientMutationId": 0
  }
}
```

#### Edit Lift
```js
mutation EditLiftMutation($input: EditLiftMutationInput!) {
  editLift(input: $input) {
    lift {
      name,
      id,
      sets,
    }
  }
}

// Variables
{
  "input": {
      "id": "TGlmdDozMzk=",
      "workout_id": "50",
      "sets": 3,
      "reps": 3,
      "weight": 100,
      "name": "test update",
      "clientMutationId": 0
  }
}
```

### Other Random Relay queries that may or may not work
```js
{
  workout(id:1) {
    id,
    lifts {
      edges {
        cursor,
        node {
          id,
          name,
          sets,
          reps
        }
      },
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
}
```

##### Getting 'first' for free with connections
```js
{
  workout(id:1) {
    id,
    lifts(first:1) {
      edges {
        cursor,
        node {
          id,
          name,
          sets,
          reps
        }
      },
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
}
```

##### Kitchen Sink
```
{
  liftToWorkout: lift(id:1) {
    id,
    sets,
    name,
    workout {
      edges {
        cursor,
        node {
          id,
          name,
          date
        }
      }
    }
  }
  workout: workout(id:1) {
    id,
    lifts(first: 2) {
      edges {
        cursor,
        node {
          id,
          name,
          sets,
          reps
        }
      },
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  },
  account: account(id:1) {
    id,
    email,
    workouts {
      edges {
        cursor,
        node {
          id,
          name,
          date
        }
      }
    }
  }
}
```

##### Finding by globalId
```js
query AccountQuery {
  node(id: "QWNjb3VudDox") {
    id
    ... on Account {
      name,
      email
    }
  }
}
```

##### Using Cursors
```js
{
  workout: workout(id:1) {
    id,
    name,
    lifts(first: 1) {
      edges {
        cursor,
        node {
          id,
          name
        }
      }
    }
  }
  workoutCont: workout(id:1) {
    id,
    name,
    lifts(first: 5 after: "YXJyYXljb25uZWN0aW9uOjA=") {
      pageInfo {
        hasPreviousPage,
        hasNextPage
      }
      edges {
        cursor,
        node {
          id,
          name
        }
      }
    }
  }
}
```

## DB (knex)

Stil figuring out why, but if I'm tinkering and killing the servr during a seed or migration bad things can happy. in that case

```sh
knex migrate:rollback

knex migrate:latest
```
