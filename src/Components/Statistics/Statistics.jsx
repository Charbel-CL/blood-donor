import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import './Statistics.css';

const Statistics = () => {
  const stats = [
    {
      id: 1,
      title: 'Lives Saved',
      value: 1200,
      description: 'Number of lives saved through our platform.'
    },
    {
      id: 2,
      title: 'Total Donations',
      value: 5000,
      description: 'Total blood donations received so far.'
    },
    {
      id: 3,
      title: 'Active Donors',
      value: 2500,
      description: 'Number of active blood donors.'
    },
  ];

  const { ref, inView } = useInView({
    triggerOnce: true, 
    threshold: 0.1 
  });

  return (
    <Container id="statistics" className="my-5" ref={ref}>
      <h2 className="text-center text-4xl pb-5 text-white">Our Impact</h2>
      <Row className="justify-content-center">
        {stats.map(stat => (
          <Col key={stat.id} md={4} className="mb-4">
            <Card className="stat-card">
              <Card.Body>
                <Card.Title className="stat-title">{stat.title}</Card.Title>
                <Card.Text className="stat-value">
                  {inView ? <CountUp end={stat.value} duration={2.5} separator="," suffix="+" /> : '0'}
                </Card.Text>
                <Card.Text className="stat-description">{stat.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Statistics;
