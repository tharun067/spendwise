import React, { useState } from "react";
import {Button,Modal,Form,Input,DatePicker,Select} from "antd";
function AddExpense({
  isExpenseModalVisible,
  handleExpenseCancel,
  onFinish,
}) {
  const [form] = Form.useForm();
  const [selectedOption, setSelectedOption] = useState("");
    const [customValue, setCustomValue] = useState("");
    const handleSelectChange = (value) => {
      setSelectedOption(value);
      if (value !== 'other') {
        setCustomValue("")
      }
    };
    const handleCustomInputChange = (e) => {
      setCustomValue(e.target.value);
    }
  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Add Expense"
      visible={isExpenseModalVisible}
      onCancel={handleExpenseCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "expense");
          form.resetFields();
        }}
      >
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the name of the transaction!",
            },
          ]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Amount"
          name="amount"
          rules={[
            { required: true, message: "Please input the expense amount!" },
          ]}
        >
          <Input type="number" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[
            { required: true, message: "Please select the expense date!" },
          ]}
        >
          <DatePicker className="custom-input" format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          label="Tag"
          name="tag"
          style={{ fontWeight: 600 }}
          rules={[{ required: true, message: "Please select a tag!" }]}
        >
          {selectedOption !== "other" ? (
            <Select
              className="select-input-2"
              onChange={handleSelectChange}
              value={selectedOption}>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="Education">Education</Select.Option>
              <Select.Option value="Travel">Travel</Select.Option>
              <Select.Option value="other">other</Select.Option>
            </Select>) : (
            <Input
              value={customValue}
              onChange={handleCustomInputChange}
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button className="btn btn-blue" type="primary" htmlType="submit">
            Add Expense
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddExpense;
