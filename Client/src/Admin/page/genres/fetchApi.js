import axios from 'axios'
const apiURL = process.env.REACT_APP_API_URL;

export const createGenres = async (genreData) => {
  try {
    const res = await axios.post('/api/genre/add', genreData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const allGenres = async () => {
  try {
    const res = await axios.get(`/api/genre/all`)
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const deleteGenre = async (id) => {
  try {
    const res = await axios.delete(`/api/genre/delete/${id}`)
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const updateGenre = async (genreId, genreData) => {
  try {
    const res = await axios.put(`/api/genre/update/${genreId}`, genreData)
    return res.data
  } catch (error) {
    console.log(error)
  }
}