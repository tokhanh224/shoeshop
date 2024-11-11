import { BackwardFilled } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import type { FormProps } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import "./Auth.css";
type FieldType = {
  email?: string;
  password?: string;
};
const SignUp = () => {
  const nav = useNavigate();
  const [messageAPI, contextHolder] = message.useMessage();
  const { mutate } = useMutation({
    mutationFn: async (users: FieldType) => {
      try {
        await axios.post(`http://localhost:5000/signup`, users);
        messageAPI.success("SignUp success");
      } catch (error) {
        messageAPI.error((error as any).response.data);
      }
    },
  });
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    mutate(values);
    nav("/signin");
  };
  return (
    <div className="signup-container">
      <Link to={`/`}>
        <Button type="primary" className="back-button">
          <BackwardFilled /> Back
        </Button>
      </Link>
      <div className="signup-page">
        {contextHolder}
        <h2>Sign Up</h2>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="email"
            name="email"
            rules={[
              { required: true, type: "email", message: "Please input email!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="password"
            name="password"
            rules={[{ required: true, message: "Please input password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              SignUp
            </Button>
             <Link to={`/signin`}>
            <ins>SignIn</ins>
            </Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
