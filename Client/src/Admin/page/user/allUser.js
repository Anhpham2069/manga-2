import { Table, Space } from 'antd'
import React from 'react'

const AllUser = () => {


    const dataSource = [
        {
          key: '1',
          name: 'Mike',
          age: 32,
          address: '10 Downing Street',
        },
        {
          key: '2',
          name: 'John',
          age: 42,
          address: '10 Downing Street',
        },
      ];
      
      const columns = [
        {
          title: 'Id',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Tên',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: 'Cấp bậc',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: 'Ngày thêm ',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: 'Hành động ',
          dataIndex: 'address',
          key: 'action',
            render: (_, record) => (
            <Space size="middle">
                <a>Cập nhật</a>
                <a>Xóa</a>
            </Space>
        )},
       
      ];
      
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />;
    </div>
  )
}

export default AllUser