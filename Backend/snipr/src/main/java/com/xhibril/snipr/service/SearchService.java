package com.xhibril.snipr.service;
import com.xhibril.snipr.dto.snippet.SnippetResponse;
import com.xhibril.snipr.model.Snippet;
import com.xhibril.snipr.repository.SnippetRepository;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;


@Service
public class SearchService {

    private final SnippetRepository snippetRepo;

    public SearchService(SnippetRepository snippetRepo){
        this.snippetRepo = snippetRepo;
    }

    public List<SnippetResponse> searchSnippets(Long userId, String query, List<String> tags, List<String> languages ){
        List<Snippet> snippetList = snippetRepo.findAllByUserId(userId);
        List<Snippet> firstFilteredSnippets = firstFilter(snippetList, tags, languages);

        if(query == null){
            List<SnippetResponse> snippetResponses = new ArrayList<>();

            for(Snippet snippet : firstFilteredSnippets){
                SnippetResponse res = new SnippetResponse(snippet.getTitle(), snippet.getCode(), snippet.getDescription());
                snippetResponses.add(res);
            }
            return snippetResponses;
        }

        // replace anything thats not letter, space or num w space
        query = query.replaceAll("[^a-zA-Z0-9\\s]", "");
        List<SnippetResponse> secondFilteredSnippets = firstCheck(firstFilteredSnippets, query);

        return secondFilteredSnippets;
    }


    public List<Snippet> firstFilter(List<Snippet> snippetList, List<String> tags, List<String> languages){
        List<Snippet> firstFilteredSnippets = new ArrayList<>();

        if(snippetList != null){
            for(Snippet snippet : snippetList){

                // both lang n tags included
                if(tags != null && languages != null){

                    if(snippet.getLanguages().containsAll(languages) &&
                            snippet.getTags().containsAll(tags)){

                        firstFilteredSnippets.add(snippet);
                    }
                    // only tags included
                } else if (tags != null){

                    if(snippet.getTags().containsAll(tags)){
                        firstFilteredSnippets.add(snippet);
                    }

                    // only langs included
                } else if (languages != null){
                    if(snippet.getLanguages().containsAll(languages)){
                        firstFilteredSnippets.add(snippet);
                    }
                } else {
                    firstFilteredSnippets.add(snippet);
                }
            }
        }

        return firstFilteredSnippets;
    }




    public List<SnippetResponse> firstCheck(List<Snippet> snippetList, String query){
        List<SnippetResponse> filteredList = new ArrayList<>();

        String[] splitQuery = query.trim().toLowerCase().split("\\s+");

        for(Snippet snippet : snippetList){
            int score = 0;

            for(String word : splitQuery){
                if(snippet.getTitle().toLowerCase().contains(word)){
                    score ++;
                } else {
                    score += secondCheck(snippet, word);
                }
            }

            if(score > 0){
                SnippetResponse snippetResponse = new SnippetResponse(
                        snippet.getTitle(),
                        snippet.getCode(),
                        snippet.getDescription()
                );

                filteredList.add(snippetResponse);
            }
        }

        return filteredList;
    }


    public int secondCheck(Snippet snippet, String word){
        int score = 0;

        char[] queryChars = word.toCharArray();
        String title = snippet.getTitle().toLowerCase();

        for(char c : queryChars){
            if(title.indexOf(c) != -1){ // check if exists inside
                score ++;
            }
        }

        // allow for small mistakes
        if(score > word.length() - 1){
            return 1;
        } else {
            return 0;
        }
    }
}
