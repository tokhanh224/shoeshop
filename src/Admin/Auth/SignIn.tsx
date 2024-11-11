import { BackwardFilled } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import type { FormProps } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import "./Auth.css"
type FieldType = {
  email?: string;
  password?: string;
};

const SignIn = () => {
  const [messageAPI, contextHolder] = message.useMessage();
  const navigate = useNavigate(); // Để điều hướng sau khi đăng nhập thành công
  const { mutate } = useMutation({
    mutationFn: async (users: FieldType) => {
      try {
        const response = await axios.post(
          `http://localhost:5000/signin`,
          users
        );
        const { accessToken, user } = response.data; // Giả sử response trả về có accessToken và user

        // Kiểm tra xem có dữ liệu không
        console.log("Login successful", accessToken, user);

        // Lưu vào localStorage
        localStorage.setItem("voucher", "WELCOME10"); // Lưu voucher dưới dạng chuỗi
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user)); // Lưu thông tin user dưới dạng chuỗi JSON

        messageAPI.success("Signin success");

        // Hiển thị voucher bằng alert
        alert(`Chúc mừng bạn vừa nhận được 1 voucher`);

        // Điều hướng đến trang Profile sau khi đăng nhập thành công
        navigate("/profile");
      } catch (error) {
        messageAPI.error((error as any).response.data);
      }
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    mutate(values);
  };

  return (
    <div>
      {contextHolder}
      <div>
        <Link to={`/`}>
          <Button>
            <BackwardFilled /> Back
          </Button>
        </Link>
      </div>
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
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please input your email!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default SignIn;
