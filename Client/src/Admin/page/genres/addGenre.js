import React, { useState } from 'react';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { createGenres } from './fetchApi';
import { addGenre } from '../../../redux/slice/genreSlice';

const GenreForm = () => {
  const dispatch = useDispatch();
  const newGenre = useSelector((state) => state.genres);

  const [genreName, setGenreName] = useState('');

  const handleInputChange = (e) => {
    setGenreName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Generate a unique ID using uuidv4
      const id = uuidv4();

      // Call the createGenres function to add the genre
      const result = await createGenres({ id, genreName });

      // Dispatch the action to update the Redux store with the new genre
      dispatch(addGenre(result));

      // Show success message
      message.success('Thêm thể loại mới thành công');

      // Reset the genreName state after successful submission
      setGenreName('');

      // Log the result if needed
      console.log(result);
    } catch (error) {
      // Show error message
      message.error('Thêm thể loại mới không thành công');

      // Log the error for debugging
      console.error('Error while creating genre:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='text-lg flex flex-col'>
      <label className='text-lg'>Tên thể loại:</label>
      <input
        className='border-[1px] border-bd-color my-4 p-2'
        type="text"
        value={genreName}
        onChange={handleInputChange}
        required
      />

      {/* Add other fields if needed */}

      <button type="submit" className='bg-primary-color text-white p-2'>
        Thêm thể loại
      </button>
    </form>
  );
};

export default GenreForm;
