import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail, createUser } from "@/lib/data-access"
import { hashPassword, createToken, setAuthCookie, validateEmail, validatePassword } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password } = body

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { success: false, error: "First name, last name, email, and password are required" },
        { status: 400 },
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 })
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json({ success: false, error: passwordValidation.message }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email.toLowerCase())
    if (existingUser) {
      return NextResponse.json({ success: false, error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const newUser = await createUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "customer",
      phone: "",
      addresses: [],
    })

    // Create JWT token
    const token = await createToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    })

    // Set HTTP-only cookie
    setAuthCookie(token)

    // Return user data (without password)
    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: `${newUser.firstName} ${newUser.lastName}`,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        avatar: "/diverse-user-avatars.png",
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
