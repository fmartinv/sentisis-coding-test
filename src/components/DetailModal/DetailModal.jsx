import { Modal } from 'antd';

export const DetailModal = (props) => {
	const { data, onCancel, onAdd } = props;

	if (data === null) {
		return null;
	}
	//function that returns a copy of the object by adding a modified copy of the data
	const increment = () => {
		const dataCopy = { ...data };
		dataCopy.units = dataCopy.units + 1;

		onAdd(dataCopy);
	};

	return (
		<Modal
			title={data.name}
			visible={true}
			onOk={increment}
			onCancel={onCancel}
			okText='Add'
		>
			<h3>Type: </h3>
			<p>{data.type}</p>
			<h3>Description: </h3>
			<p>{data.description}</p>
			<h3>Units:</h3>
			<h3>{data.units}</h3>
		</Modal>
	);
};
