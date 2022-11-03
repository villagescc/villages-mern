import React from 'react';
import {useParams} from "react-router-dom";

const Person = () => {
  const { username } = useParams()

  return (
    <div>
      Person { username }
    </div>
  );
};

export default Person;
