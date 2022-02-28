import { Table, InputNumber } from 'antd';
import { useState, useEffect, useCallback, useRef } from 'react';
import { DetailModal } from '../DetailModal/DetailModal';
export const Home = () => {
	const [dataSource, setDataSource] = useState([]);
	const [detailModal, setDetailModal] = useState(null);
	const activeRow = useRef(null);

	const showModal = (rowData, i) => {
		activeRow.current = i;
		setDetailModal(rowData);
	};

	const handleCancel = () => {
		activeRow.current = null;
		setDetailModal(null);
	};

	const handleOk = (row) => {
		//Making a state copy to update data.
		const dataSourceCopy = [...dataSource];
		const i = activeRow.current;
		dataSourceCopy[i] = row;
		console.log(dataSourceCopy);
		setDataSource(dataSourceCopy);
		handleCancel();
	};

	const parseData = useCallback((data) => {
		const modifiedData = data.map((ticket) => {
			const ticketObject = {
				id: ticket.id,
				name: ticket.title,
				type: ticket.type,
				date: new Date(ticket.releaseDate).toLocaleDateString('es-ES'),
				releaseDate: ticket.releaseDate,
				price: ticket.price,
				units: 0,
				description: ticket.description,
			};

			return ticketObject;
		});

		return modifiedData;
	}, []);

	const fetchData = useCallback(async () => {
		const request = await fetch(
			'https://my-json-server.typicode.com/davidan90/demo/tickets'
		);
		const response = await request.json();
		const result = parseData(response);
		setDataSource(result);
	}, [parseData]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleOnChange = useCallback(
		(value, rowData) => {
			const dataCopy = [...dataSource];
			const elementIndex = dataCopy.findIndex((el) => el.id === rowData.id);

			if (elementIndex > -1) {
				dataCopy[elementIndex].units = value;
				setDataSource(dataCopy);
			}
		},
		[dataSource]
	);

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			render: (value, rowData, i) => (
				<span onClick={() => showModal(rowData, i)}>{value}</span>
			),
		},
		{
			title: 'Type',
			dataIndex: 'type',
			key: 'type',
		},
		{
			title: 'Release Date',
			dataIndex: 'date',
			key: 'date',
			defaultSortOrder: 'descend',
			sorter: (a, b) => a.releaseDate - b.releaseDate,
		},
		{
			title: 'Unit Selector',
			dataIndex: 'units',
			key: 'units',
			render: (units, rowData) => (
				<InputNumber
					min={0}
					max={20}
					value={units}
					defaultValue={units}
					onChange={(value) => handleOnChange(value, rowData)}
				/>
			),
		},
		{
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
		},
	];

	return (
		<>
			<Table dataSource={dataSource} columns={columns} pagination={false} />
			<DetailModal
				data={detailModal}
				onCancel={handleCancel}
				onAdd={(row) => handleOk(row)}
			/>
		</>
	);
};
