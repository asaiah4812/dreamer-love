

interface ContentProps {
  id:number;
  color: string;
  title:string;
  content1:string;
  content2?: string | null;
  content3?: string | null;
}

const Content: ContentProps[] = [
  {
    id: 1,
    color: "#8e2de2",
    title: "The Moment I Knew",
    content1: `There was a moment when I looked at you and realized that you were
          everything I had been searching for. Your smile, your laugh, the way
          your eyes light up when you talk about things you love - it all
          captivated me. I knew then that my heart had found its home.`,
    content2: `Every day since then has been a beautiful journey of discovering more
          reasons to fall in love with you. The little things you do, the way
          you care, how you understand me without words - these are the
          treasures I hold close.`,
    content3: `I want you to know that my love for you grows deeper with each passing
          day. You are the first thought in my morning and the last whisper in
          my dreams at night. You are my everything.`,
  },
  {
    id: 2,
    color: "#d066ae",
    title: "What You Mean To Me",
    content1: ` You are my sunshine on cloudy days, my shelter in the storm, my peace
          in chaos. You are the melody that plays in my heart and the dreams
          that fill my nights. You are not just someone I love - you are a part
          of who I am.`,
    content2: `When I think of beauty, I think of your soul. When I think of
          kindness, I remember your touch. When I think of joy, I see your
          smile. You have redefined what love means to me, showing me depths of
          emotion I never knew existed.`,
  },
  {
    id: 3,
    color: "#ff5e62",
    title: "Promises From My Heart",
    content1: `I promise to stand by you through every storm and celebrate with you
          in every triumph. I promise to listen when you speak and hear what
          remains unspoken. I promise to grow with you, dream with you, and
          build a life filled with beautiful memories.`,
    content2: `I promise to stand by you through every storm and celebrate with you
          in every triumph. I promise to listen when you speak and hear what
          remains unspoken. I promise to grow with you, dream with you, and
          build a life filled with beautiful memories.`,
  },
  {
    id: 4,
    color: "#ff9966",
    title: "The Little Things",
    content1: ` It's the way you scrunch your nose when you laugh. How you always
          remember my favorite song. The coffee you make just the way I like it.
          The texts you send just to say you're thinking of me. These little
          things are the threads that weave the beautiful tapestry of our love.`,
    content2: `I cherish how you know when I need space and when I need to be held. I
          adore how you remember the small details of stories I tell. I love
          that you can read my expressions and understand my silences. These
          little things are actually the biggest things.`,
  },
  {
    id: 5,
    color: "#c471ed",
    title: "Our Future Together",
    content1: `When I close my eyes and imagine our future, I see a home filled with
          laughter, walls that have witnessed our growth, and a garden where our
          love continues to bloom. I see adventures taken hand in hand and quiet
          evenings of comfortable silence.`,
    content2: ` I dream of building traditions that become our legacy and creating
          memories that will warm our hearts in years to come. I look forward to
          facing challenges together, knowing that whatever comes our way, we'll
          face it as one. Our future is the most beautiful story yet to be
          written.`,
  },
];

export default function LoveContent() {
  // const session = await auth()

  return (
    <>
      <p className="intro-text">
        Welcome to Love Notes, where words become whispers of the heart. Send
        beautiful messages to your loved one that express the depth of your
        feelings. Each section below contains heartfelt messages you can share
        with that special someone.
      </p>
      {Content.map((content) => (
        <section
          key={content.id}
          className="page-content__section"
          data-bg-color={content.color}
        >
          <h2>{content.title}</h2>

          <p>{content.content1}</p>
          {content.content2 && <p>{content.content2}</p>}

          {content.content3 && <p>{content.content3}</p>}
        </section>
      ))}

      <section className="page-content__section" data-bg-color="#f64f59">
        <h2>Send Your Love</h2>

        <div className="message-form">
          <p className="form-intro">
            Write your own love message below and send it to your special
            someone. Let your heart speak through your words.
          </p>

          <div className="input-group">
            <label htmlFor="recipient">Their Name</label>
            <input
              type="text"
              id="recipient"
              placeholder="Who is this message for?"
            />
          </div>

          <div className="input-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              rows={5}
              placeholder="Write your love message here..."
            ></textarea>
          </div>

          <button className="send-button">Send With Love ❤️</button>
        </div>
      </section>
    </>
  );
}
