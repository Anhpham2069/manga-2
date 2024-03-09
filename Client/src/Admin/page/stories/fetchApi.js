import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;


export const addStoryApi = async (formData) => {
  try {
    const res = await axios.post(`http://localhost:8000/api/story/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

  export const getAllStoriesApi = async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${apiURL}/api/story/all-story`, {
        params: {
          page,
          limit,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  };

  export const updateStory = async (storyId,data)=>{
    try {
      console.log(storyId)

      const res = await axios.put(`${apiURL}/api/story/update/${storyId}`,{
        storyId: storyId,
        sTitle : data.sTitle,
        sDescription: data.sDescription,
        sAuthor: data.sAuthor,
        sGenres: data.sGenres,
        sChapter: data.sChapter,
        sViews: data.sViews,
        sSaves: data.sSaves,
        sStatus: data.sStatus,
      })
      return res.data
    } catch (error) {
      console.log(error)      
    }
  }
  export const updateChapter = async (formData) => {
    console.log(formData)
    try {
      const response = await axios.put(`${apiURL}/api/story/update-chapter`,  formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
export const deleteStoryApi = async (storyId)=>{
  try {
    const res = await axios.delete(`${apiURL}/api/story/delete/${storyId}` )
    return res.data
  } catch (error) {
    console.log(error)
  }
}