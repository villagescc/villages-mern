import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'store';
import { getUser } from 'store/slices/user';

const Person = () => {
    const dispatch = useDispatch();
    const { id } = useParams();

    const { user } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUser(id));
    }, []);

    return (
        <div>
            Person {id}
            Username: {user.username}
        </div>
    );
};

export default Person;
