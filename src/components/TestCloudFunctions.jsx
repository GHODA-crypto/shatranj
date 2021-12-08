import { Card, Form, notification, Input, Button } from "antd";
import { useMemo, useState } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";

const { TextArea } = Input;

const TestCloudFunctions = () => {
	const { Moralis } = useMoralis();
	window.Moralis = Moralis;

	const openNotification = ({ message, description }) => {
		notification.open({
			placement: "bottomRight",
			message,
			description,
			onClick: () => {
				console.log("Notification Clicked!");
			},
		});
	};

	return (
		<div
			style={{
				margin: "auto",
				display: "flex",
				marginTop: "25",
				width: "50vw",
			}}>
			<Card
				title={
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}>
						Cloud Functions Test
					</div>
				}
				size="large"
				style={{
					width: "100%",
					boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
					border: "1px solid #e7eaf3",
					borderRadius: "0.5rem",
				}}>
				<Form
					onFinish={async (values) => {
						console.log("Here", values);
						const params = JSON.parse(values.parameters);

						const results = await Moralis.Cloud.run(
							`${values.functionName}`,
							params
						);

						console.log(results);
						openNotification({
							message: "🔊 Test Cloud Functions",
							description: `${results}`,
						});
					}}>
					<Form.Item
						label={`Function Name`}
						name={`functionName`}
						required
						style={{ marginBottom: "15px" }}>
						<Input placeholder="function name" />
					</Form.Item>
					<Form.Item
						label={`Params`}
						name={`parameters`}
						initialValue={`{}`}
						required
						style={{ marginBottom: "15px" }}>
						<TextArea placeholder="params" />
					</Form.Item>
					<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
						<Button type="primary" htmlType="submit">
							Run
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

export default TestCloudFunctions;
