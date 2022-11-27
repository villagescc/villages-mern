import React from 'react';
import {useParams} from "react-router-dom";

import PayForm from "./PayForm";

const Index = () => {
  const { userId } = useParams();

  return (
    <div>
      <PayForm recipientId={userId} />
    </div>
  );
};

export default Index;
