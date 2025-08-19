import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { getUserById, updateUser } from "@/lib/data-access"
import type { Address } from "@/lib/types"

// GET /api/user/addresses - Get user addresses
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserById(currentUser.userId)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      addresses: user.addresses,
    })
  } catch (error) {
    console.error("Get user addresses error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/user/addresses - Add new address
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, firstName, lastName, company, address1, address2, city, state, zipCode, country, isDefault } = body

    // Validation
    if (!firstName || !lastName || !address1 || !city || !state || !zipCode || !country) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const user = await getUserById(currentUser.userId)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Create new address
    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      userId: currentUser.userId,
      type: type || "shipping",
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      company: company?.trim() || "",
      address1: address1.trim(),
      address2: address2?.trim() || "",
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode.trim(),
      country: country.trim(),
      isDefault: Boolean(isDefault),
    }

    // If this is set as default, unset other defaults of the same type
    const updatedAddresses = user.addresses.map((addr) => ({
      ...addr,
      isDefault: addr.type === newAddress.type && newAddress.isDefault ? false : addr.isDefault,
    }))

    updatedAddresses.push(newAddress)

    const updatedUser = await updateUser(currentUser.userId, {
      addresses: updatedAddresses,
    })

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      address: newAddress,
      message: "Address added successfully",
    })
  } catch (error) {
    console.error("Add address error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
