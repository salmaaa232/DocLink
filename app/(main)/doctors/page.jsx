import { Card, CardContent } from "@/components/ui/card"
import { SPECIALTIES } from "@/lib/specialities"
import Link from "next/link"

const SpecialitiesPage = () => {
  return (
    <>
      <div className='flex flex-col items-center justify-center mt-15 mb-8 text-center'>
        <h1 className='text-3xl font-bold text-black mb-2'>Find your Doctor</h1>
        <p className='text-gray-400 text-lg'>Browse by specialty or view all available healthcare providers</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {SPECIALTIES.map((speciality) =>
          <Link key={speciality.name} href={`/doctors/${speciality.name}`}>
            <Card>
              <CardContent>
                <div>
                  <div>{speciality.icon}</div>
                </div>
                <h3>{speciality.name}</h3>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </>
  )
}

export default SpecialitiesPage