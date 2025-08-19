import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { getUserById, updateUser } from "@/lib/data-access"

// PUT /api/user/addresses/[id] - Update address
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, company, address1, address2, city, state, zipCode, country, isDefault } = body

    const user = await getUserById(currentUser.userId)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const addressIndex = user.addresses.findIndex((addr) => addr.id === params.id)
    if (addressIndex === -1) {
      return NextResponse.json({ success: false, error: "Address not found" }, { status: 404 })
    }

    // Update the address
    const updatedAddress = {
      ...user.addresses[addressIndex],
      firstName: firstName?.trim() || user.addresses[addressIndex].firstName,
      lastName: lastName?.trim() || user.addresses[addressIndex].lastName,
      company: company?.trim() || user.addresses[addressIndex].company,
      address1: address1?.trim() || user.addresses[addressIndex].address1,
      address2: address2?.trim() || user.addresses[addressIndex].address2,
      city: city?.trim() || user.addresses[addressIndex].city,
      state: state?.trim() || user.addresses[addressIndex].state,
      zipCode: zipCode?.trim() || user.addresses[addressIndex].zipCode,
      country: country?.trim() || user.addresses[addressIndex].country,
      isDefault: isDefault !== undefined ? Boolean(isDefault) : user.addresses[addressIndex].isDefault,
    }

    const updatedAddresses = [...user.addresses]
    updatedAddresses[addressIndex] = updatedAddress

    // If this is set as default, unset other defaults of the same type
    if (updatedAddress.isDefault) {
      updatedAddresses.forEach((addr, index) => {
        if (index !== addressIndex && addr.type === updatedAddress.type) {
          addr.isDefault = false
        }
      })
    }

    const updatedUser = await updateUser(currentUser.userId, {
      addresses: updatedAddresses,
    })

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      address: updatedAddress,
      message: "Address updated successfully",
    })
  } catch (error) {
    console.error("Update address error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/user/addresses/[id] - Delete address
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserById(currentUser.userId)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const addressIndex = user.addresses.findIndex((addr) => addr.id === params.id)
    if (addressIndex === -1) {
      return NextResponse.json({ success: false, error: "Address not found" }, { status: 404 })
    }

    const updatedAddresses = user.addresses.filter((addr) => addr.id !== params.id)

    const updatedUser = await updateUser(currentUser.userId, {
      addresses: updatedAddresses,
    })

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully",
    })
  } catch (error) {
    console.error("Delete address error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
