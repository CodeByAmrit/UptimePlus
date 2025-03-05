const fs = require('fs');
const pg = require('pg');
const url = require('url');
require('dotenv').config()

console.log(process.env.DB_USER);

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUa+8NfdRAXvcaBf3pDSwd/NwJpEowDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvYjgxM2NkMjEtMzIwZS00OTQzLTljNzctODkwMmM1NjY0
NDVjIFByb2plY3QgQ0EwHhcNMjQwODA2MDgzMjE0WhcNMzQwODA0MDgzMjE0WjA6
MTgwNgYDVQQDDC9iODEzY2QyMS0zMjBlLTQ5NDMtOWM3Ny04OTAyYzU2NjQ0NWMg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAIFWA2I5
FGcTyf69J+CxBQAdbQpmW4Uf78BNWHzJfdQZxbD0uiuLQutP5HRXXKbs0acY62ue
Q6mB7iZdDgfwHzLld41eqRAs0bEpiG39ImlnsB7DRiTQcSg5WJd1zgfn0S6TOguR
9FhKUm7GZVKv9MlgbPReav4zPderXR/KzIwheRM8juzSxXnGIA93+kunaUKyWoaN
PYpELBiPF4TOzRa6JVOy9YsQE7xFFsPRAMFseuaAMIDTFM/QSeuSFCeO5UQT8vHO
2nZMYHd5J1gW2beTm3+vACgF1ZN+R4zJWKhKpnnHadAZByDRl83llhaHFXI7deAP
RYp55R4Ugcon+OHNUy7Xi8N+zoCcE0Eg6c90AQu42kxZv0dB47NCUfnI9Iy8bL/9
CRYr0LtTcpVETfMzB1GVkrFzqJLR0v6x5M0CiLXQLm11kGUZSRK2sNEArO8fRnB3
ZMQTzYN4N9Px7+69t9CcLp3TRT1RrYmEMhLcJyMHffHOj+QS9bW1rj5K6QIDAQAB
oz8wPTAdBgNVHQ4EFgQUbitluSxRvVx2DTgKVkZjmq/4sxwwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAAkH1D3VyN389edA
a7zVFM4IABDikVEuqfNTsS1y3OXzZL+o+Fx3uOQch8u9FlFZvEIX+zPFOjNu5rC+
xwiTuH9bjMP7DvvkLz4GXqVjJA/9kOVJCRlzLkFmqYtoEM0/HhaatJYII2H0kO6x
X2l0K3isqlImwn86Z+iFGmT/3d6WPPpn3g8CL8yNS4KsPKx5+8gEUoQ479e1pRrz
XZZIRiM/fxkIKrm08SspSpCAor4smRl9+bgYwt1DcVT1ev5GuIPUGWOfNOfL9S2D
VxnnwdiMLwI+bAlhSIz1E/fnh+aCXqNZBzSYN8c3uA1f4kRdEyCz7ZTAjfjN9AHs
+X64Bm4iMEPjNy3Vt8+JhHAecN9FoxuZBWV+D+ZiKQFPIOV6m70Ma+NpOLK3Pk8F
+RWP9cpev9wVw3UUwpayJ6i8nlMxVJyATj5zoL9VRDL71fmjcgvjG88fz7UVs5LT
UI7Iavxg64hZa4cfu20Yw2rl9W6Y3Pe9B+P9qTdYs/jwgGx1lQ==
-----END CERTIFICATE-----
`,
    }
};

async function connectToDatabase() {
    const client = new pg.Client(config);
    try {
        await client.connect();
        console.log("Connected to the database");
        const result = await client.query("SELECT VERSION()");
        console.log("PostgreSQL Version:", result.rows[0].version);
    } catch (err) {
        console.error("Database Connection Error:", err);
    } finally {
        await client.end();
    }
}

connectToDatabase();
