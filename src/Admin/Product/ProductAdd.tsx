import { BackwardFilled } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, FormProps, Input, InputNumber, message } from "antd";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
type FieldType = {
  img: string;
  title: string;
  reviews: string;
  prevPrice: number;
  newPrice: number;
  company: string;
  color: string;
  category: string;
};


const ProductAdd = () => {
  const [messageAPI, contextHolder] = message.useMessage()
  const {mutate} = useMutation({
    mutationFn: async (product: FieldType) =>{
      await axios.post(`http://localhost:5000/products`, product)
    },
    onSuccess: () =>{
      messageAPI.success("Added Product")
    }
  })
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    mutate(values)
  };
  return (
    <div>
      {contextHolder}
      <div>
        <Link to={`/admin/list`}>
        <Button>
          <BackwardFilled/>Back
        </Button>
        </Link>
      </div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        // initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="name"
          name="title"
          rules={[{ required: true, message: "Please input Product name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="price"
          name="newPrice"
          rules={[{ required: true, message: "Please input Product price!" },
            {type: 'number', min: 0, message: "Must be a number greater or equal 0"}
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item<FieldType>
          label="Reviews"
          name="reviews"
          rules={[{ required: true, message: "Please input Product reviews!" }]}
        >
          <Input.TextArea rows={5}/>
        </Form.Item>
        <Form.Item<FieldType>
          label="image"
          name="img"
          rules={[{ required: true, message: "Please input Product image link!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductAdd;
