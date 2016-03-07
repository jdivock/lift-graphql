import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Card, CardHeader, CardText } from 'material-ui';

const styles = {
  card: {
    margin: '0 7px',
  },
  cardHeader: {
    height: 30,
  },
};

const Lift = ({ lift = {} }) => {
  let weight;
  if (lift && lift.weight) {
    weight = `${lift.weight} x `;
  } else {
    weight = '';
  }

  return (
    <Card style={styles.card}>
      <CardHeader
        style={styles.cardHeader}
        title={lift.name}
      />
      <CardText>
        {weight} {lift.sets} x {lift.reps}
      </CardText>
    </Card>
  );
};

Lift.propTypes = {
  lift: PropTypes.object,
};

export { Lift };

export default Relay.createContainer(Lift, {
  fragments: {
    lift: () => Relay.QL`
      fragment on Lift {
        name,
        weight,
        sets,
        reps
      }
    `,
  },
});
