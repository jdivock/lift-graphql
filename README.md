# Lift-GraphQL

Yeah, writing this (again), using graphQL/Relay, let's see if I can actually get it working.

It'd make a crapton more sense to just get this going with react native and parse or some precooked backend, but what would I learn then eh?

## To load db

```
$ psql -f scripts/createdb.sql <user>
```

### Relay Queries

##### Basic
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

#### Mutations

##### Query
```js
mutation AddLiftMutation($input: AddLiftMutationInput!) {
    addLiftMutation(input: $input) {
    newLift {
      id,
      weight,
      sets
    },
    clientMutationId
  }
}
```

##### Variables
```js
{
  "input": {
    "workoutid": "V29ya291dDox",
    "sets": 1,
    "reps": 2,
    "weight": 100,
    "name": "stuff",
    "clientMutationId": 0
  }
}
```
