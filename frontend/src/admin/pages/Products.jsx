import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { productService } from '../../services/productService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách sản phẩm từ API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getList();
      setProducts(res.data);
    } catch (error) {
      message.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await productService.delete(id);
      message.success('Xóa sản phẩm thành công');
      fetchProducts(); // Load lại bảng
    } catch (error) {
      message.error('Xóa thất bại');
    }
  };

  const columns = [
    { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
    { title: 'Giá', dataIndex: 'price', key: 'price', render: (val) => `${val.toLocaleString()}đ` },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} type="primary" ghost>Sửa</Button>
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3>Danh sách sản phẩm</h3>
        <Button type="primary" icon={<PlusOutlined />}>Thêm sản phẩm mới</Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={products} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Products;