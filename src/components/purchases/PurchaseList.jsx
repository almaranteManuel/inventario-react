import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Typography, DatePicker } from 'antd';
import PurchaseCreate from './PurchaseCreate';
import PurchaseUpdate from './PurchaseEdit';
import moment from 'moment/moment'
moment.locale('es');

const { Text } = Typography;
const { confirm } = Modal;

const PurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [totalPurchases, setTotalPurchases] = useState(0);

  const loadPurchases = async () => {
    try {
      const PurchaseList = await window.api.loadPurchases();
      setPurchases(PurchaseList);
      const total = PurchaseList.reduce((sum, sale) => sum + sale.totalAmount, 0);
      setTotalPurchases(total);
    } catch (error) {
      console.error('Error loading suppliers:', error);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  const handlePurchaseAdded = async () => {
    await loadPurchases();
  };

  const handlePurchaseUpdate = async () => {
    await loadPurchases();
  };

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const clearFilters = () => {
    setFilteredInfo({});
    setFilteredPurchases(purchases);
    const total = purchases.reduce((sum, sale) => sum + sale.totalAmount, 0);
    setTotalPurchases(total);
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
    setFilteredPurchases(purchases);
    const total = purchases.reduce((sum, sale) => sum + sale.totalAmount, 0);
    setTotalPurchases(total);
  };

  const onMonthChange = (date, dateString) => {
    if (dateString) {
      const filtered = purchases.filter(sale =>
        moment(sale.date, 'YYYY-MM-DD HH:mm:ss.SSS Z').format('YYYY-MM') === dateString
      );
      setFilteredPurchases(filtered);
      const total = filtered.reduce((sum, sale) => sum + sale.totalAmount, 0);
      setTotalPurchases(total);
    } else {
      setFilteredPurchases(purchases);
      const total = purchases.reduce((sum, sale) => sum + sale.totalAmount, 0);
      setTotalPurchases(total);
    }
  };

  const handleDeletePurchase = async (purchaseId) => {
    try {
      const deletedPurchase = await window.api.deletePurchase(purchaseId);
      
      if (deletedPurchase) {
        await loadPurchases();
      }
    } catch (error) {
      console.error('Error deleting purchase:', error);
    }
  };

  const showDeleteConfirm = (purchaseId) => {
    confirm({
      title: '¿Estás seguro de que deseas eliminar este proveedor?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        handleDeletePurchase(purchaseId);
      },
      onCancel() {
        console.log('Cancelado');
      },
    });
  };

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      render: (text) => {
        const formattedDate = new Date(text).toLocaleDateString();
        return <span style={{ fontWeight: 'bold', color: '#333' }}>{formattedDate}</span>;
      },
    },
    {
      title: 'Proveedor',
      dataIndex: ['Supplier', 'name'],
      key: 'supplier_name',
      render: (text) => <span style={{ fontWeight: 'bold', color: '#333' }}>{text}</span>,
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      sortOrder: sortedInfo.columnKey === 'totalAmount' ? sortedInfo.order : null,
      render: (text) => <span style={{ fontWeight: 'bold', color: '#333' }}>$ {text}</span>,
    },
    {
      title: 'Acciones',
      key: 'action',
      render: (text, record) => (
        <Space size="small">
          <PurchaseUpdate purchase={record} onPurchaseEdit={handlePurchaseUpdate} />
          <Button onClick={() => showDeleteConfirm(record.id)} danger>
            Borrar
          </Button>
        </Space>
      ),
    },
  ];

  return (
  <>
    <PurchaseCreate onPurchaseAdded={handlePurchaseAdded} />
    <Space
      style={{
        marginBottom: 16,
      }}
    >
      <DatePicker
        picker="month"
        onChange={onMonthChange}
        placeholder="Seleccionar mes"
      />
      <Button onClick={clearFilters}>Limpiar filtros</Button>
      <Button onClick={clearAll}>Limpiar todo</Button>
    </Space>
    <br />
    <Text strong style={{paddingInline: 10, fontSize: 20}}>Total compras: ${totalPurchases.toFixed(2)}</Text>
    <Table columns={columns} dataSource={purchases} rowKey={(record) => record.id} pagination={{ pageSize: 20 }} rowHoverable={true} onChange={handleChange} />
  </>
  );
};

export default PurchaseList;
