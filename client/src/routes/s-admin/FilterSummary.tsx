// import Municipality from "../custom-hooks/Municipality";
// import YearMenu from "../Components/YearMenu";
// import useUserInfo from "../custom-hooks/useUserType";
import YearMenu from "../../Components/YearMenu";
import BrgyMenu from "../../custom-hooks/BrgyMenu";
import Municipality from "../../custom-hooks/Municipality";
import { AddressReturnDataType } from "../../custom-hooks/useFilterAddrress";
import useUserInfo from "../../custom-hooks/useUserType";

interface FilterSummaryProps {
    municipalityState: {
        state: AddressReturnDataType | undefined;
        setState: React.Dispatch<React.SetStateAction<AddressReturnDataType | undefined>>;
    };
    brgyState :  {
        state : AddressReturnDataType | undefined
        setState : React.Dispatch<React.SetStateAction<AddressReturnDataType | undefined>>
    },
    yearState?: {
        state: string | undefined;
        setState: React.Dispatch<React.SetStateAction<string | undefined>>;
    };
}

const FilterSummary = ({ municipalityState, yearState }: FilterSummaryProps) => {
    const userInfo = useUserInfo();

    return (
        <div>
            <div className="flex w-full flex-wrap gap-2">
                <div className="flex h-full w-full xl:w-96 sm:flex-nowrap flex-wrap gap-6">
                    <Municipality setAddress={municipalityState.setState} />
                    {municipalityState.state && userInfo.user_type === "lgu_admin" && (
                        <BrgyMenu
                            setBrgys={municipalityState.setState}
                            municipality_code={municipalityState.state.address_code}
                            user_info={userInfo}
                        />
                    )}
                </div>

                {yearState && (
                    <YearMenu useYearState={[yearState.state, yearState.setState]} />
                )}
            </div>
        </div>
    );
};

export default FilterSummary;