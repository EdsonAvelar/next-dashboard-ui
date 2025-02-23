"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { date, z } from "zod";
import { useState } from "react";
import InputField from "../InputField";
import SelectInput from "../SelectInput";

import ImageUploadCrop from "../ImageUploadCrop";

const schema = z.object({
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters long!" })
    .max(20, { message: "Username max size is 20!" }),
  email: z.string().email({ message: "Invalida email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "LastName name is required" }),
  phone: z.string().min(1, { message: "Phone name is required" }),
  address: z.string().min(1, { message: "Address name is required" }),
  bloodType: z.string().min(1, { message: "Blood type is required" }),
  birthday: z.date({ message: "Birthday name is required" }),
  sex: z.enum(["male", "female"], { message: "Sex is required" }),
  img: z.string().min(1, { message: "Image is required" }),
});

type Inputs = z.infer<typeof schema>;

const TeacherForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  const [croppedImg, setCroppedImg] = useState<string | null>(null);
  // Callback para quando a imagem for cortada
  const handleCroppedImage = (croppedImage: string) => {
    setCroppedImg(croppedImage);
    // Atualiza o valor do campo "img" no formulário
    setValue("img", croppedImage);
  };

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={onSubmit}
    >
      <h1 className="text-xl font-semibold">Create New Teacher</h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between gap-4 flex-wrap">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>

      <div className="flex justify-between gap-4 flex-wrap">
        <InputField
          label="FirstName"
          name="firstName"
          defaultValue={data?.firstName}
          register={register}
          error={errors?.firstName}
        />

        <InputField
          label="LastName"
          name="lastName"
          defaultValue={data?.lastName}
          register={register}
          error={errors?.lastName}
        />

        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors?.phone}
        />

        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors?.address}
        />

        <InputField
          label="BloodType"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors?.bloodType}
        />

        <InputField
          label="Birthday"
          name="birthday"
          defaultValue={data?.birthday}
          register={register}
          type="date"
          error={errors?.birthday}
        />

        {/* Utilizando o SelectInput para o campo "Sex" */}
        <SelectInput
          label="Sex"
          name="sex"
          register={register}
          defaultValue={data?.sex}
          error={errors?.sex}
          options={[
            { value: "", label: "Select Sex" },
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
        />
      </div>

      <div className="w-full justify-center flex">
        <ImageUploadCrop
          aspect={1}
          onCropComplete={handleCroppedImage}
        />
      </div>

      <button className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-500">
        {type === "create" ? "create" : "update"}
      </button>
    </form>
  );
};

export default TeacherForm;
