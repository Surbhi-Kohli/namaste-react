import { render , screen} from "@testing-library/react";
import "@testing-library/jest-dom";//to use toBeInTheDocument
import RestaurantCard from "../RestaurantCard";
import { withPromtedLabel } from "../RestaurantCard" 
import MOCK_DATA from "../mocks/resCardMock.json"
it("should render RestaurantCard component with props Data",()=>{
  render(<RestaurantCard resData={MOCK_DATA}/>);
  const name=screen.getByText("Leon's - Burgers & Wings (Leon Grill)");
  expect(name).toBeInTheDocument();
})
it("should render restaurantcard component with promoted label",()=>{
    //test HOC:withPromotedLabel
    const RenderHOC = withPromtedLabel(RestaurantCard);
   render(<RenderHOC resData={MOCK_DATA}/>);
   const label=screen.getByText("Promoted");
    const restCard=screen.getByTestId("resCard");
     expect(label).toBeInTheDocument();
     expect(restCard).toBeInTheDocument();

})