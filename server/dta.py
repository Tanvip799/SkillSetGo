import pandas as pd
from faker import Faker

# Initialize Faker
fake = Faker()


# Convert to DataFrame
df = pd.read_csv('SkillSetGo\server\mentors_with_id.csv')

# Role-based descriptions
role_descriptions = {
    "Senior Software Engineer": "Seasoned software engineer with expertise in software design, development, and system architecture.",
    "Data Scientist": "Skilled in data analysis, machine learning, and transforming data into actionable insights.",
    "DevOps Engineer": "Expert in automation, continuous integration, and efficient deployment processes.",
    "Cybersecurity Expert": "Specialist in protecting systems, networks, and data from cyber threats and vulnerabilities.",
    "AI Researcher": "Dedicated to advancing artificial intelligence through research and development in machine learning and deep learning.",
    "Blockchain Developer": "Experienced in developing and implementing blockchain solutions, including smart contracts and decentralized applications.",
    "Frontend Developer": "Proficient in creating engaging and responsive user interfaces using modern web technologies.",
    "Backend Developer": "Expert in server-side development, databases, and API integration to support frontend applications.",
    "Full Stack Developer": "Versatile developer with expertise in both frontend and backend development, capable of building complete web applications.",
    "Mobile App Developer": "Experienced in developing mobile applications for iOS and Android platforms, focusing on performance and user experience.",
    "Data Engineer": "Skilled in building and maintaining data pipelines, ensuring data integrity and availability for analysis.",
    "Product Manager": "Responsible for defining product vision, strategy, and roadmap to deliver value to customers and stakeholders.",
    "UX/UI Designer": "Specialist in user experience and interface design, creating intuitive and visually appealing digital products.",
    "Systems Analyst": "Experienced in analyzing and improving system processes to enhance business operations.",
    "Network Engineer": "Proficient in designing, implementing, and managing network infrastructure to ensure optimal performance and security."
}

# Adding the new columns
df["description"] = df["current_position"].apply(lambda x: role_descriptions.get(x, "No description available"))
df["previous_employer_1"] = [fake.company() for _ in range(len(df))]
df["previous_employer_2"] = [fake.company() for _ in range(len(df))]
df["address_1"] = [fake.address() for _ in range(len(df))]
df["address_2"] = [fake.address() for _ in range(len(df))]

# Display the updated DataFrame
print(df)

# Save to a CSV file
df.to_csv('extended_mentors.csv', index=False)
