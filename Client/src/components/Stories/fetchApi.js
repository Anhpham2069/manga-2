import axios from "axios";

export const getAllStories = async (slug) => {
    try {
      const response = await axios.get(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`)
  
      return response.data.data;
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  };