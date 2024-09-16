import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toUnits } from "thirdweb";
import { CustomButton, FormField, Loader } from "../components";
import { money } from "../assets";
import { checkIfImage } from "../utils";
import { useStateContext } from "../context";

interface FormState {
  name: string;
  title: string;
  description: string;
  target: number | null;
  deadline: string;
  image: string;
}

const CreateCampaign: FC = () => {
  const navigate = useNavigate();

  const { setMenuActive, address, createCampaign } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [buttonLabel, setButtonLabel] = useState<string>("");
  const [form, setForm] = useState<FormState>({
    name: "",
    title: "",
    description: "",
    target: null,
    deadline: "",
    image: "",
  });

  useEffect(() => {
    const validateForm = () => {
      const { name, title, description, target, deadline, image } = form;
      const isFormValid =
        name.trim() !== "" &&
        title.trim() !== "" &&
        description.trim() !== "" &&
        target !== null &&
        target > 0 &&
        deadline.trim() !== "" &&
        image.trim() !== "" &&
        address;
      setIsButtonDisabled(!isFormValid);
    };

    setButtonLabel(
      !address
        ? "Wallet not connected. Please connect your wallet first!"
        : "Submit new campaign"
    );

    validateForm();
  }, [form, address]);

  const handleFormFieldChange = (
    fieldName: keyof FormState,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [fieldName]: e.target?.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    checkIfImage(form.image, async (exist: boolean) => {
      if (exist) {
        await createCampaign({
          ...form,
          target: toUnits(String(form.target), 18),
        });
        setIsLoading(false);
        navigate("/");
        setMenuActive("Dashboard");
      } else {
        alert("Invalid image URL");
        setForm({ ...form, image: "" });
      }
    });
  };

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-xl sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-4 sm:min-w-96 bg-[#3a3a43] rounded-xl">
        <h1 className="font-epilogue font-bold sm:text-2xl text-lg leading-10 text-white">
          Start a campaign
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full mt-16 flex flex-col gap-8"
      >
        <div className="flex flex-wrap gap-10">
          <FormField
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleOnChange={(e) => handleFormFieldChange("name", e)}
          />
          <FormField
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleOnChange={(e) => handleFormFieldChange("title", e)}
          />
        </div>

        <FormField
          labelName="Story *"
          placeholder="Write a story"
          isTextArea
          value={form.description}
          handleOnChange={(e) => handleFormFieldChange("description", e)}
        />

        <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] md:h-32 h-24 rounded-xl">
          <img src={money} alt="money" className="w-10 h-10 object-contain" />
          <h4 className="font-epilogue font-bold md:text-2xl text-lg text-white ml-5">
            You will get 100% of the raised amount
          </h4>
        </div>

        <div className="flex flex-wrap gap-10">
          <FormField
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="number"
            value={form.target}
            handleOnChange={(e) => handleFormFieldChange("target", e)}
          />
          <FormField
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleOnChange={(e) => handleFormFieldChange("deadline", e)}
          />
        </div>

        <FormField
          labelName="Campaign Image *"
          placeholder="Place image URL of your campaign"
          inputType="url"
          value={form.image}
          handleOnChange={(e) => handleFormFieldChange("image", e)}
        />

        <div className="flex justify-center items-center mt-10">
          <CustomButton
            btnType={"submit"}
            title={buttonLabel}
            styles={
              isButtonDisabled ? "bg-[#4b5264] text-[#28282e]" : "bg-[#1dc071]"
            }
            disabled={isButtonDisabled}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
