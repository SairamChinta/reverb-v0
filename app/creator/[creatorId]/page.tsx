import StreamView from "@/app/components/StreamView";
type CreatorPageProps = {
  params: {
    creatorId: string;
  };
};
export default function Creator({ params }: CreatorPageProps) {   
    return( <div>
        <StreamView creatorId={params.creatorId} playVideo={false}/>
    </div>);
}