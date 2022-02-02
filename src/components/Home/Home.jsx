import { Table, InputNumber } from 'antd';
import { useState, useEffect, useCallback } from 'react';

export const Home = () => {
	const [dataSource, setDataSource] = useState([]);

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
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleOnChange = (value, rowData) => {
		const dataCopy = [...dataSource];
		const elementIndex = dataCopy.findIndex((el) => el.id === rowData.id);

		if (elementIndex > -1) {
			// actualiza valor de units
			dataCopy[elementIndex].units = value;
			// luego de modificar los datos como los necesitamos actualizamos dataSource
			setDataSource(dataCopy);
		}
	};

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
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
			render: (units, rowData) => {
				return (
					<InputNumber
						min={0}
						max={20}
						defaultValue={units}
						onChange={(value) => handleOnChange(value, rowData)}
					/>
				);
			},
		},
		{
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
		},
	];

	console.log({ dataSource });

	return (
		<>
			<Table dataSource={dataSource} columns={columns} pagination={false} />
		</>
	);
};
