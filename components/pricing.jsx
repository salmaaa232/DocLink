import React from "react"
import { CardContent } from "./ui/card"
import { PricingTable } from '@clerk/nextjs';
const Pricing = () => {
  return (
    <card>
      <CardContent>
        <PricingTable />
      </CardContent>
    </card>
  )
}

export default Pricing