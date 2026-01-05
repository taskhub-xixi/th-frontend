const members = [
  {
    avatar: "https://avatars.githubusercontent.com/u/176381861?v=4",
    name: "Bintang Rias Sandiyuda",
    role: "Frontend Dev",
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/154486622?v=4",
    name: "Okta Putra Ramadhan",
    role: "Backend Dev",
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/99137927?v=4",
    name: "Rifdy Setyadi",
    role: "Databased Related",
  },
];

export default function TeamSection() {
  return (
    <section className="py-12 md:py-32">
      <div className="mx-auto max-w-3xl px-8 lg:px-0">
        <h2 className="mb-8 text-4xl font-bold md:mb-16 lg:text-5xl">About Us</h2>

        <div>
          <div className="justify-center grid grid-cols-3 gap-4 border-t py-6">
            {members.map((member, index) => (
              <div className="text-center" key={index}>
                <div className="mx-auto bg-background size-20 rounded-full border p-0.5 shadow shadow-zinc-950/5">
                  <img
                    alt={member.name}
                    className="aspect-square rounded-full object-cover"
                    height="460"
                    loading="lazy"
                    src={member.avatar || "/placeholder.svg"}
                    width="460"
                  />
                </div>
                <span className="mt-2 block text-sm">{member.name}</span>
                <span className="text-muted-foreground block text-xs">{member.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
