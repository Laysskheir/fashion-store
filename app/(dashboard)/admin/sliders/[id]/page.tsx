import { notFound } from "next/navigation";
import SliderForm from "../_components/slider-form";
import { getSlider } from "@/features/silders/actions/get-slider";

interface Props {
    params: {
        id: string;
    };
}

export default async function EditSliderPage({ params }: Props) {
    const slider = await getSlider(params.id);

    if (!slider) {
        return notFound();
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SliderForm existingSlider={slider} isEditing />
            </div>
        </div>
    );
}
