import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import React from "react";

export const ul: React.FC = props => (
  <Container maxWidth="md">
    <Typography {...props} component="ul" />
  </Container>
);

export const ol: React.FC = props => (
  <Container maxWidth="md">
    <Typography {...props} component="ol" />
  </Container>
);

export const li: React.FC = props => <Typography {...props} component="li" />;
