import Relay from 'react-relay';

export default class AddLiftMutation extends Relay.Mutation {
  static fragments = {
    workout: () => Relay.QL`
      fragment on Workout {
        id,
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation { addLift }`;
  }

  getVariables() {
    const {
      workout,
      name,
      reps,
      sets,
      weight,
    } = this.props;

    return {
      workout_id: workout.id,
      name,
      reps,
      sets,
      weight,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddLiftMutationPayload @relay(pattern:true) {
        workout {
          lifts {
            edges {
              node {
                name,
                reps,
                sets,
                weight,
              }
            }
          }
        },
        newLiftEdge,
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'workout',
      parentID: this.props.workout.id,
      connectionName: 'lifts',
      edgeName: 'newLiftEdge',
      rangeBehaviors: {
        '': 'append',
        'orderby(newest)': 'prepend',
      },
    }];
  }
}
