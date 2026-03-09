import React, { useState, useEffect } from 'react';
import { Input, Button, Form, message } from 'antd';
import { useDispatch } from 'react-redux';
import { updateGenre } from './fetchApi';
import { updateGenreById } from '../../../redux/slice/genreSlice';

const { TextArea } = Input;

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const UpdateGenreForm = ({ genre, onUpdateSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (genre) {
      form.setFieldsValue({
        genreName: genre.genreName || '',
        slug: genre.slug || '',
        description: genre.description || ''
      });
    }
  }, [genre, form]);

  const handleNameChange = (e) => {
    const name = e.target.value;
    form.setFieldsValue({
      genreName: name,
      slug: generateSlug(name)
    });
  };

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      const payload = {
        genreName: values.genreName,
        slug: values.slug,
        description: values.description || ""
      };
      await updateGenre(genre._id, payload);
      dispatch(updateGenreById({ id: genre._id, updatedGenre: payload }));
      onUpdateSuccess();
    } catch (error) {
      console.error('Failed to update genre', error);
      message.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleUpdate}
    >
      <Form.Item
        label="Tên thể loại"
        name="genreName"
        rules={[{ required: true, message: 'Vui lòng nhập tên thể loại!' }]}
      >
        <Input onChange={handleNameChange} placeholder="Nhập tên thể loại" />
      </Form.Item>

      <Form.Item
        label="Slug"
        name="slug"
        rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
      >
        <Input placeholder="Slug đường dẫn" />
      </Form.Item>

      <Form.Item
        label="Mô tả"
        name="description"
      >
        <TextArea rows={4} placeholder="Nhập mô tả thể loại" />
      </Form.Item>

      <div className="flex justify-end gap-3 mt-4">
        <Button onClick={onCancel}>Hủy</Button>
        <Button type="primary" htmlType="submit" loading={loading} className="bg-primary-color">
          Cập nhật
        </Button>
      </div>
    </Form>
  );
};

export default UpdateGenreForm;
