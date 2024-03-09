// UpdateGenreForm.js

import React, { useState,useEffect, } from 'react';
import { Input, Button } from 'antd';
import { useSelector,useDispatch } from 'react-redux';
import { updateGenre } from './fetchApi'; // Update the import path accordingly
import { updateGenreById } from '../../../redux/slice/genreSlice';

const UpdateGenreForm = ({ genre, onUpdateSuccess, onCancel }) => {

    const dispatch = useDispatch()

    const [updatedGenreName, setUpdatedGenreName] = useState('');

  // Update the local state when the genre prop changes
  useEffect(() => {
    setUpdatedGenreName(genre ? genre.genreName : '');
  }, [genre])
  const handleUpdate = async () => {
    try {
      await updateGenre(genre._id, updatedGenreName);
      dispatch(updateGenreById({ id: genre._id, updatedGenre: { genreName: updatedGenreName } }));
      onUpdateSuccess()
    } catch (error) {
      console.error('Failed to update genre', error);
      // Handle error state or show a notification to the user
    }
  };

  return (
    <div>
      <Input
        value={updatedGenreName}
        onChange={(e) => setUpdatedGenreName(e.target.value)}
      />
      <Button type="dashed" onClick={handleUpdate}>
        Update
      </Button>
      <Button onClick={onCancel}>Cancel</Button>
    </div>
  );
};

export default UpdateGenreForm;
