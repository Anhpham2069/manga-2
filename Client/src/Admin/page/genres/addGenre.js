import React, { useState } from 'react';
import { message, Input, Button, Form } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { createGenres } from './fetchApi';
import { addGenre } from '../../../redux/slice/genreSlice';

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

const GenreForm = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const handleNameChange = (e) => {
    const name = e.target.value;
    form.setFieldsValue({
      genreName: name,
      slug: generateSlug(name)
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const id = uuidv4();
      const payload = {
        genreId: id,
        genreName: values.genreName,
        slug: values.slug,
        description: values.description || ""
      };

      const result = await createGenres(payload);

      dispatch(addGenre(result.newGenre || result));
      message.success('Thêm thể loại mới thành công');
      form.resetFields();
    } catch (error) {
      message.error('Thêm thể loại mới không thành công');
      console.error('Error while creating genre:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
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
        <Input placeholder="SLUG hiển thị trên URL" />
      </Form.Item>

      <Form.Item
        label="Mô tả"
        name="description"
      >
        <TextArea rows={4} placeholder="Nhập mô tả (không bắt buộc)" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} className="bg-primary-color w-full">
          Thêm thể loại
        </Button>
      </Form.Item>
    </Form>
  );
};

export default GenreForm;
